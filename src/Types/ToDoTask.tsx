// Types matching your C# ToDoTask class
export interface ToDoTask {
  id: number;
  title: string;
  description: string;
  created: Date;
  deadLine: Date;
  updatedOn: Date;
  isCompleted: boolean;
}


export interface CreateTaskRequest {
  title: string
  description: string
  deadLine: Date
}
