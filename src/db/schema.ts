import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	isComplete: integer("isComplete", { mode: "boolean" })
		.notNull()
		.default(false),
	createdAt: integer("createdAt", { mode: "timestamp" }).default(
		sql`(unixepoch())`,
	),
	updatedAt: integer("updatedAt", { mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.$onUpdate(() => sql`(unixepoch())`),
});
