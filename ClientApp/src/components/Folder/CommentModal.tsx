import { createComment, getCommentsByFolder } from '@/apis/comment';
import { CommentDto } from '@/types/Comment/Comment';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface CommentModalProps {
  show: boolean;
  onClose: () => void;
  folderId: number;
  onCommentAdded: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  show,
  onClose,
  folderId,
  onCommentAdded,
}) => {
  const [content, setContent] = useState('');
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show) {
      fetchComments();
    }
  }, [show]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getCommentsByFolder(folderId);
      setComments(data);
    } catch (error) {
      toast.error('Failed to load comments');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      await createComment({ content, folderId });
      toast.success('Comment added successfully');
      setContent('');
      await fetchComments();
      onCommentAdded();
    } catch (error) {
      toast.error('Failed to add comment');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Comments</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 py-3">
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {loading ? (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" /> Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <p className="text-muted text-center">No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="mb-3 p-3 border rounded bg-light shadow-sm"
              >
                <div className="fw-semibold text-primary">
                  {comment.authorName || 'Anonymous'}
                </div>
                <div className="text-muted small mb-2">
                  {new Date(comment.created).toLocaleString()}
                </div>
                <div>{comment.content}</div>
              </div>
            ))
          )}
        </div>

        <Form className="pt-3">
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={3}
              className="rounded shadow-sm"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your comment..."
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="px-4 pb-4 pt-2 justify-content-center">
        <Button variant="secondary" onClick={onClose} className="me-2">
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? (
            'Sending...'
          ) : (
            <>
              <FaPaperPlane className="me-2" />
              Send
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CommentModal;
