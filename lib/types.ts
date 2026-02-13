export interface Bookmark {
    id: string;
    user_id: string;
    url: string;
    title: string;
    created_at: string;
}

export type BookmarkInsert = Omit<Bookmark, 'id' | 'created_at'>;
export type BookmarkUpdate = Partial<Omit<Bookmark, 'id' | 'user_id'>>;
