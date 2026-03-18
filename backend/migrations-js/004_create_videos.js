exports.up = async function(knex) {
  await knex.schema.createTable('videos', (t) => {
    t.increments('id').primary();
    t.integer('section_id').unsigned().notNullable()
      .references('id').inTable('sections').onDelete('CASCADE');
    t.string('title', 255).notNullable();
    t.text('description').nullable();
    t.string('youtube_url', 500).notNullable();
    t.integer('order_index').notNullable();
    t.integer('duration_seconds').nullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.unique(['section_id', 'order_index']);
    t.index('section_id');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('videos');
};
