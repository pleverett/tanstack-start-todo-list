import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const todos = sqliteTable('todos', {
  id: integer({ mode: 'number' }).primaryKey({
    autoIncrement: true,
  }),
  name: text('name').notNull(),
  isComplete: integer('isComplete', { mode: 'boolean'}).notNull().default(false),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(
    sql`(unixepoch())`,
  ),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(
    sql`(unixepoch())`,
  ).$onUpdate(() => sql`(uniexpoch())`)
})
