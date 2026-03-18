exports.up = async function(knex) {
  await knex.schema.createTable('refresh_tokens', (t) => {
    t.increments('id').primary();
    t.bigInteger('user_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    t.string('token_hash', 500).notNullable();
    t.timestamp('expires_at').notNullable();
    t.timestamp('revoked_at').nullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.index(['user_id', 'token_hash']);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('refresh_tokens');
};
