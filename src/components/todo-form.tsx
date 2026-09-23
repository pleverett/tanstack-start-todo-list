import { PlusIcon } from "lucide-react";
import type { SubmitEvent } from "react";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { LoadingSwap } from "./ui/loading-swap";
import z from "zod";
import { todos } from "#/db/schema";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { db } from "#/db";
import { redirect } from "@tanstack/react-router";

const addTodo = createServerFn({ method: "POST"}).validator(
  z.object({ name: z.string().min(1) })
).handler(async ({data}) => {
  await db.insert(todos).values({...data, isComplete: false})

  throw redirect({ to: '/' })
})

export function TodoForm() {
	const nameRef = useRef<HTMLInputElement>(null);
	const [isLoading, setIsLoading] = useState(false);
  const addTodoFn = useServerFn(addTodo)

	async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
    const name = nameRef.current?.value
    if (!name) return

    setIsLoading(true)
    await addTodoFn({ data: { name }})
    setIsLoading(false)
	}

	return (
		<form onSubmit={handleSubmit} className="flex gap-2">
			<Input
				autoFocus
				ref={nameRef}
				placeholder="Enter your todo..."
				className="flex-1"
				aria-label="Name"
			/>
			<Button type="submit" disabled={isLoading}>
				<LoadingSwap isLoading={isLoading} className="flex gap-2 items-center">
					<PlusIcon /> Add
				</LoadingSwap>
			</Button>
		</form>
	);
}
