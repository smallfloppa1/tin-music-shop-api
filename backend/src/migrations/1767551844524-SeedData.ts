import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedData1767551844524 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      const passwordHash = '$2a$12$F4a/aiAtzPfyf5z8PUDTzOBPVSSEYsmi.u6MSVZz.mfpudYvLWD4i';

      await queryRunner.query(`
            INSERT INTO \`user\` (id, email, first_name, last_name, password_hash, role, shipping_address) VALUES
            (1, 'admin@musicshop.com', 'Admin', 'User', '${passwordHash}', 'ADMIN', 'Headquarters, Music St.'),
            (2, 'customer@gmail.com', 'John', 'Doe', '${passwordHash}', 'CUSTOMER', '123 Guitar Lane, Rock City');
        `);

      await queryRunner.query(`
            INSERT INTO \`product_category\` (id, name, slug, parent_id) VALUES
            (1, 'Guitars', 'guitars', NULL),
            (2, 'Electric Guitars', 'electric-guitars', 1),
            (3, 'Acoustic Guitars', 'acoustic-guitars', 1),
            (4, 'Accessories', 'accessories', NULL),
            (5, 'Amplifiers', 'amplifiers', NULL);
        `);

      await queryRunner.query(`
            INSERT INTO \`product\` (name, description, price, stock, image_url, category_id) VALUES
            ('Fender Stratocaster Player Series', 'The inspiring sound of a Stratocaster is one of the foundations of Fender.', 849.99, 10, 'https://example.com/strat.jpg', 2),
            ('Gibson Les Paul Standard', 'The new Les Paul Standard returns to the classic design that made it relevant, played, and loved.', 2499.00, 5, 'https://example.com/les-paul.jpg', 2),
            ('Ibanez RG550', 'The RG is the most recognizable and distinctive guitar in the Ibanez line.', 999.99, 8, 'https://example.com/ibanez-rg.jpg', 2),

            ('Martin D-28', 'The D-28 is the dreadnought by which all others are judged.', 2999.00, 3, 'https://example.com/martin-d28.jpg', 3),
            ('Taylor 214ce', 'This Grand Auditorium delivers a clear, balanced tone.', 999.00, 12, 'https://example.com/taylor-214ce.jpg', 3),
            ('Yamaha FG800', 'A standard acoustic guitar model with simple and traditional looks and outstanding quality.', 199.99, 20, 'https://example.com/yamaha-fg800.jpg', 3),

            ('Ernie Ball Regular Slinky Strings', 'World class strings played by legends around the world.', 6.99, 100, 'https://example.com/strings.jpg', 4),
            ('Dunlop Tortex Picks (12 Pack)', 'Highly durable picks with great memory and just the right flexibility.', 4.99, 200, 'https://example.com/picks.jpg', 4),
            ('Fender Deluxe Cable', 'Highest quality materials and braided shielding.', 19.99, 50, 'https://example.com/cable.jpg', 4),
            
            ('Marshall DSL40CR', 'The DSL40CR is a 40W valve combo amp suitable for any playing environment.', 749.99, 6, 'https://example.com/marshall-amp.jpg', 5);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DELETE FROM \`product\``);
      await queryRunner.query(`DELETE FROM \`product_category\``);
      await queryRunner.query(`DELETE FROM \`user\``);
    }
}
