import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("events", (table) => {
    table.index("time");
    table.index("location_id");
    table.index("type_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("events", (table) => {
    table.dropIndex("time");
    table.dropIndex("location_id");
    table.dropIndex("type_id");
  });
}
