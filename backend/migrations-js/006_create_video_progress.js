exports.up = async function(knex) {
  await knex.schema.createTable('video_progress', (t) => {
    t.increments('id').primary();
    t.bigInteger('user_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    t.integer('video_id').unsigned().notNullable()
      .references('id').inTable('videos').onDelete('CASCADE');
    t.integer('last_position_seconds').notNullable().defaultTo(0);
    t.boolean('is_completed').notNullable().defaultTo(false);
    t.timestamp('completed_at').nullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.unique(['user_id', 'video_id']);
    t.index(['user_id', 'video_id']);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('video_progress');
};
