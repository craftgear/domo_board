import { z } from "zod";
import { Edge } from "@xyflow/react";

import type { CustomNodeProps } from "@/components/nodes";
const ProjectIdSchema = z.string().brand("ProjceId").nullable();
export type ProjectId = z.infer<typeof ProjectIdSchema>;

const BoardIdSchema = z.string().brand("BoardId").nullable();
export type BoardId = z.infer<typeof BoardIdSchema>;

export const BIG_PICTURE = "big picture" as const;
export const DESIGN_LEVEL = "design level" as const;

const NodesSchema = z.custom<CustomNodeProps[]>();
const EdgesSchame = z.custom<Edge[]>();
const BoardSchema = z.object({
  projectId: ProjectIdSchema,
  id: BoardIdSchema,
  title: z.string(),
  nodes: NodesSchema,
  edges: EdgesSchame,
  previousBoardId: BoardIdSchema,
  nextBoardId: BoardIdSchema,
  mode: z.enum([BIG_PICTURE, DESIGN_LEVEL]),
  nodeIdInEditing: z.string().nullable(),
});

export type Board = z.infer<typeof BoardSchema>;
