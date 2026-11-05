export interface NoteOriginal {
  _id: string;
  title: string;
  description: string;
  isPrivate: boolean;
  isDisabledForMainBlogPage: boolean;
  createdAt: string;
  updatedAt: string;
  priority: number;
}

export interface NoteItem {
  original: NoteOriginal;
  bg: {
    src: string;
    size: { w: number; h: number };
    type: string;
  };
  slug: string;
  brief: string;
}

export interface NotesApiResponse {
  success: boolean;
  data: NoteItem[];
  pagination: {
    totalPages: number;
    currentPage: number;
    totalNotes: number;
  };
}
