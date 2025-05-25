import { FilePrefixDto } from './FilePrefixDto';

export interface FileSetDto {
  key: string;
  label: string;
  requirements: FilePrefixDto[];
}
