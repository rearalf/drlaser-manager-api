import { MigrationInterface, QueryRunner } from 'typeorm';

export class PersonManagementSchema1763332333196 implements MigrationInterface {
  name = 'PersonManagementSchema1763332333196';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."person_contact_contact_type_enum" AS ENUM('EMAIL', 'PHONE', 'WHATSAPP')`,
    );
    await queryRunner.query(
      `CREATE TABLE "person_contact" ("id" SERIAL NOT NULL, "person_id" integer NOT NULL, "contact_value" character varying(255) NOT NULL, "contact_type" "public"."person_contact_contact_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_1094fd036d694f9949ef1c19e39" PRIMARY KEY ("id")); COMMENT ON COLUMN "person_contact"."person_id" IS 'Foreign key to the Person table'; COMMENT ON COLUMN "person_contact"."contact_value" IS 'Value of the contact detail'; COMMENT ON COLUMN "person_contact"."contact_type" IS 'Type of contact (EMAIL, PHONE, etc.)'; COMMENT ON COLUMN "person_contact"."created_at" IS 'Timestamp of the record creation'; COMMENT ON COLUMN "person_contact"."updated_at" IS 'Timestamp of the last record update'; COMMENT ON COLUMN "person_contact"."deleted_at" IS 'Soft deletion timestamp'`,
    );
    await queryRunner.query(
      `CREATE TABLE "person_type" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_f900a8c313411c7da8fcbba7975" PRIMARY KEY ("id")); COMMENT ON COLUMN "person_type"."name" IS 'Name of the person type'; COMMENT ON COLUMN "person_type"."description" IS 'Detailed description of the person type'; COMMENT ON COLUMN "person_type"."created_at" IS 'Timestamp of the record creation'; COMMENT ON COLUMN "person_type"."updated_at" IS 'Timestamp of the last record update'; COMMENT ON COLUMN "person_type"."deleted_at" IS 'Soft deletion timestamp'`,
    );
    await queryRunner.query(
      `CREATE TABLE "person" ("id" SERIAL NOT NULL, "first_name" character varying(100) NOT NULL, "middle_name" character varying(100), "last_name" character varying(100) NOT NULL, "profile_picture_name" character varying(255), "profile_picture_url" character varying(2048), "user_id" integer, "person_type_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_5157fa65538cae06e66c922c898" UNIQUE ("user_id"), CONSTRAINT "REL_5157fa65538cae06e66c922c89" UNIQUE ("user_id"), CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id")); COMMENT ON COLUMN "person"."first_name" IS 'First name of the person'; COMMENT ON COLUMN "person"."middle_name" IS 'Middle name of the person'; COMMENT ON COLUMN "person"."last_name" IS 'Last name of the person'; COMMENT ON COLUMN "person"."profile_picture_name" IS 'Profile picture file name'; COMMENT ON COLUMN "person"."profile_picture_url" IS 'Profile picture URL'; COMMENT ON COLUMN "person"."user_id" IS 'Foreign key to the User table'; COMMENT ON COLUMN "person"."person_type_id" IS 'Foreign key to the PersonType table'; COMMENT ON COLUMN "person"."created_at" IS 'Timestamp of the record creation'; COMMENT ON COLUMN "person"."updated_at" IS 'Timestamp of the last record update'; COMMENT ON COLUMN "person"."deleted_at" IS 'Soft deletion timestamp'`,
    );
    await queryRunner.query(
      `ALTER TABLE "person_contact" ADD CONSTRAINT "FK_ed78b7b2d50539bbc6796c70b4e" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" ADD CONSTRAINT "FK_5157fa65538cae06e66c922c898" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" ADD CONSTRAINT "FK_1711d76c14c9146c23087558bb3" FOREIGN KEY ("person_type_id") REFERENCES "person_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "person" DROP CONSTRAINT "FK_1711d76c14c9146c23087558bb3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" DROP CONSTRAINT "FK_5157fa65538cae06e66c922c898"`,
    );
    await queryRunner.query(
      `ALTER TABLE "person_contact" DROP CONSTRAINT "FK_ed78b7b2d50539bbc6796c70b4e"`,
    );
    await queryRunner.query(`DROP TABLE "person"`);
    await queryRunner.query(`DROP TABLE "person_type"`);
    await queryRunner.query(`DROP TABLE "person_contact"`);
    await queryRunner.query(
      `DROP TYPE "public"."person_contact_contact_type_enum"`,
    );
  }
}
