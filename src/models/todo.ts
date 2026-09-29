import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";
import { TODO_CATEGORIES, TODO_PRIORITIES } from "@/lib/todos/constants";

const todoSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: null,
    },
    priority: {
      type: String,
      enum: [...TODO_PRIORITIES],
      default: "medium",
    },
    category: {
      type: String,
      enum: [...TODO_CATEGORIES],
      default: "personal",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

todoSchema.index({ userId: 1, deletedAt: 1, createdAt: -1 });

export type TodoDocument = InferSchemaType<typeof todoSchema>;

export const Todo: Model<TodoDocument> =
  models.Todo || model<TodoDocument>("Todo", todoSchema);