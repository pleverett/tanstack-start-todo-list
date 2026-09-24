import { createFileRoute, Link } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { ListTodoIcon, PlusIcon } from 'lucide-react';
import type { JSX } from 'react';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import { Checkbox } from '#/components/ui/checkbox';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '#/components/ui/empty';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '#/components/ui/table';
import { cn } from '#/lib/utils.ts';
import { db } from '@/db';

type Todo = {
	id: string;
	name: string;
	isComplete: boolean;
	createdAt: Date;
	updatedAt: Date;
};
const serverLoader = createServerFn({ method: 'GET' }).handler(() => {
	return db.query.todos.findMany();
});

export const Route = createFileRoute('/')({
	component: Home,
	loader: () => {
		return serverLoader();
	},
});

function Home() {
	const todos: Todo[] = Route.useLoaderData();
	const completeCount = todos.filter((t) => t.isComplete).length;
	const totalCount = todos.length;

	return (
		<div className="min-h-screen container space-y-8">
			<div className="flex justify-between items-center gap-4">
				<div className="space-y-2">
					<h1 className="text-4xl font-bold">Todo List</h1>
					{totalCount > 0 && (
						<Badge variant="outline">
							{completeCount} of {totalCount} completed
						</Badge>
					)}
				</div>
				<div>
					<Button size="sm" asChild>
						<Link to="/todos/new">
							<PlusIcon /> Add Todo
						</Link>
					</Button>
				</div>
			</div>

			<TodoListTable todos={todos} />
		</div>
	);
}

function TodoListTable({ todos }: { todos: Todo[] }) {
	if (todos.length === 0) {
		return (
			<Empty className="border border-dashed">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<ListTodoIcon />
					</EmptyMedia>
					<EmptyTitle>No Todos</EmptyTitle>
					<EmptyDescription>Try adding a new todo</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button asChild>
						<Link to="/todos/new">
							<PlusIcon /> Add Todo
						</Link>
					</Button>
				</EmptyContent>
			</Empty>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow className="hover:bg-transparent">
					<TableHead></TableHead>
					<TableHead>Task</TableHead>
					<TableHead>Created On</TableHead>
					<TableHead className="w-0"></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{todos.map((todo: Todo) => (
					<TodoTableRow key={todo.id} {...todo} />
				))}
			</TableBody>
		</Table>
	);
}

function TodoTableRow({ createdAt, id, name, isComplete }: Todo): JSX.Element {
	return (
		<TableRow>
			<TableCell>
				<Checkbox checked={isComplete} />
			</TableCell>
			<TableCell
				className={cn(
					'font-medium',
					isComplete && 'text-muted-foreground line-through',
				)}
			>
				{name}
			</TableCell>
			<TableCell className="text-sm text-muted-foreground">
				{formatDate(createdAt)}
			</TableCell>
			<TableCell>
				<div className="flex items-center justify-end gap-1">
					<Button>
						<Link to="/todos/$id/edit" params={{ id }}>
							Edit
						</Link>
					</Button>
				</div>
			</TableCell>
		</TableRow>
	);
}

function formatDate(date: Date) {
	const formatter = new Intl.DateTimeFormat(undefined, {
		dateStyle: 'short',
	});

	return formatter.format(date);
}
