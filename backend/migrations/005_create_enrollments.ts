import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('enrollments', (t) => {
    t.increments('id').primary();
    t.bigInteger('user_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    t.integer('subject_id').unsigned().notNullable()
      .references('id').inTable('subjects').onDelete('CASCADE');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.unique(['user_id', 'subject_id']);
    t.index(['user_id', 'subject_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('enrollments');
}
