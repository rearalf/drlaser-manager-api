import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDoctorAndSpecialtySchema1763352424684
  implements MigrationInterface
{
  name = 'CreateDoctorAndSpecialtySchema1763352424684';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "specialty" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_6caedcf8a5f84e3072c5a380a16" UNIQUE ("name"), CONSTRAINT "PK_9cf4ae334dc4a1ab1e08956460e" PRIMARY KEY ("id")); COMMENT ON COLUMN "specialty"."name" IS 'Unique name of the medical specialty'; COMMENT ON COLUMN "specialty"."description" IS 'Detailed description of the specialty'; COMMENT ON COLUMN "specialty"."created_at" IS 'Timestamp of the record creation'; COMMENT ON COLUMN "specialty"."updated_at" IS 'Timestamp of the last record update'; COMMENT ON COLUMN "specialty"."deleted_at" IS 'Soft deletion timestamp'`,
    );
    await queryRunner.query(
      `CREATE TABLE "doctor_specialty" ("id" SERIAL NOT NULL, "doctor_id" integer NOT NULL, "specialty_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_32a95d0b8737e4b4943b75b7b1c" UNIQUE ("doctor_id", "specialty_id"), CONSTRAINT "PK_bb2b1ec7556ecdf92c8b6cc8cf7" PRIMARY KEY ("id")); COMMENT ON COLUMN "doctor_specialty"."doctor_id" IS 'Foreign key to the Doctor table'; COMMENT ON COLUMN "doctor_specialty"."specialty_id" IS 'Foreign key to the Specialty table'; COMMENT ON COLUMN "doctor_specialty"."created_at" IS 'Timestamp of the record creation'; COMMENT ON COLUMN "doctor_specialty"."updated_at" IS 'Timestamp of the last record update'; COMMENT ON COLUMN "doctor_specialty"."deleted_at" IS 'Soft deletion timestamp'`,
    );
    await queryRunner.query(
      `CREATE TABLE "doctor" ("id" SERIAL NOT NULL, "person_id" integer NOT NULL, "specialty_id" integer NOT NULL, "qualification" character varying(100), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_fb38f3d7d38878d734a3fbb562b" UNIQUE ("person_id"), CONSTRAINT "REL_fb38f3d7d38878d734a3fbb562" UNIQUE ("person_id"), CONSTRAINT "PK_ee6bf6c8de78803212c548fcb94" PRIMARY KEY ("id")); COMMENT ON COLUMN "doctor"."person_id" IS 'Foreign key to the Person table'; COMMENT ON COLUMN "doctor"."specialty_id" IS 'Foreign key to the primary Specialty table'; COMMENT ON COLUMN "doctor"."qualification" IS 'Doctor’s qualification or professional license number'; COMMENT ON COLUMN "doctor"."created_at" IS 'Timestamp of the record creation'; COMMENT ON COLUMN "doctor"."updated_at" IS 'Timestamp of the last record update'; COMMENT ON COLUMN "doctor"."deleted_at" IS 'Soft deletion timestamp'`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_specialty" ADD CONSTRAINT "FK_f094b41552f4096abd621b72896" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_specialty" ADD CONSTRAINT "FK_7792fabe9bfec740f0ec9027347" FOREIGN KEY ("specialty_id") REFERENCES "specialty"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor" ADD CONSTRAINT "FK_fb38f3d7d38878d734a3fbb562b" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor" ADD CONSTRAINT "FK_bb2b1ec7556ecdf92c8b6cc8cf7" FOREIGN KEY ("specialty_id") REFERENCES "specialty"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "doctor" DROP CONSTRAINT "FK_bb2b1ec7556ecdf92c8b6cc8cf7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor" DROP CONSTRAINT "FK_fb38f3d7d38878d734a3fbb562b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_specialty" DROP CONSTRAINT "FK_7792fabe9bfec740f0ec9027347"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_specialty" DROP CONSTRAINT "FK_f094b41552f4096abd621b72896"`,
    );
    await queryRunner.query(`DROP TABLE "doctor"`);
    await queryRunner.query(`DROP TABLE "doctor_specialty"`);
    await queryRunner.query(`DROP TABLE "specialty"`);
  }
}
