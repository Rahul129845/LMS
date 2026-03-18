import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('subjects', (t) => {
    t.increments('id').primary();
    t.string('title', 255).notNullable();
    t.string('slug', 255).notNullable().unique();
    t.text('description').nullable();
    t.string('thumbnail_url', 500).nullable();
    t.boolean('is_published').defaultTo(false);
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.index('slug');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('subjects');
}
