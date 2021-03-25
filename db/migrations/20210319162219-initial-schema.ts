import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("locations", (table) => {
    table.increments();
    table.string("name").notNullable();
    table.unique(["name"]);
  });
  await knex.schema.createTable("types", (table) => {
    table.increments();
    table.string("name").notNullable();
    table.unique(["name"]);
  });
  await knex.schema.createTable("events", (table) => {
    table.increments();
    table.integer("location_id").unsigned().notNullable();
    table.foreign("location_id").references("locations.id");
    table.integer("type_id").unsigned().notNullable();
    table.foreign("type_id").references("types.id");
    table.timestamp("time").notNullable();
    table.string("hash").notNullable();
    table.unique(["hash"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  for (const table of ["events", "locations", "types"]) {
    await knex.schema.dropTable(table);
  }
}
