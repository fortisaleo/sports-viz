export interface Todo {
  id: string;
  created: string;
  text: string;
  completed: boolean;
}

export interface Team {
  id: number;
  createdAt: string;
  name: string;
  abbreviation: string;
  nickName: string;
  yearFounded: string;
  city: string;
}
