import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('sections', (t) => {
    t.increments('id').primary();
    t.integer('subject_id').unsigned().notNullable()
      .references('id').inTable('subjects').onDelete('CASCADE');
    t.string('title', 255).notNullable();
    t.integer('order_index').notNullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.unique(['subject_id', 'order_index']);
    t.index('subject_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('sections');
}
