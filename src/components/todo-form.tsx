import { redirect } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { PlusIcon } from "lucide-react";
import type { SubmitEvent } from "react";
import { useRef, useState } from "react";
import z from "zod";
import { db } from "#/db";
import { todos } from "#/db/schema";
import type { Todo } from "#/routes";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { LoadingSwap } from "./ui/loading-swap";

const addTodo = createServerFn({ method: "POST" })
	.validator(z.object({ name: z.string().min(1) }))
	.handler(async ({ data }) => {
		await db.insert(todos).values({ ...data, isComplete: false });

		throw redirect({ to: "/" });
	});

const updateTodo = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.string().min(1), name: z.string().min(1) }))
	.handler(async ({ data }) => {
		await db.update(todos).set(data).where(eq(todos.id, data.id));

		throw redirect({ to: "/" });
	});

export function TodoForm({ todo }: { todo?: Todo }) {
	const nameRef = useRef<HTMLInputElement>(null);
	const [isLoading, setIsLoading] = useState(false);
	const addTodoFn = useServerFn(addTodo);
	const updateTodoFn = useServerFn(updateTodo);

	async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		const name = nameRef.current?.value;
		if (!name) return;

		setIsLoading(true);
		if (todo == null) {
			await addTodoFn({ data: { name } });
		} else {
			await updateTodoFn({ data: { name, id: todo.id } });
		}
		setIsLoading(false);
	}

	return (
		<form onSubmit={handleSubmit} className="flex gap-2">
			<Input
				autoFocus
				ref={nameRef}
				placeholder="Enter your todo..."
				className="flex-1"
				aria-label="Name"
				defaultValue={todo?.name}
			/>
			<Button type="submit" disabled={isLoading}>
				<LoadingSwap isLoading={isLoading} className="flex gap-2 items-center">
					{todo == null ? (
						<>
							<PlusIcon /> Add
						</>
					) : (
						"Update"
					)}
				</LoadingSwap>
			</Button>
		</form>
	);
}
