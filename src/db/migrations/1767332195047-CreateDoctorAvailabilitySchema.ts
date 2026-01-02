import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDoctorAvailabilitySchema1767332195047
  implements MigrationInterface
{
  name = 'CreateDoctorAvailabilitySchema1767332195047';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "doctor_unavailability" ("id" SERIAL NOT NULL, "doctor_id" integer NOT NULL, "start_time" TIMESTAMP WITH TIME ZONE NOT NULL, "end_time" TIMESTAMP WITH TIME ZONE NOT NULL, "reason" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_72b9aaa4d14eb5970c59db0df97" PRIMARY KEY ("id")); COMMENT ON COLUMN "doctor_unavailability"."doctor_id" IS 'Foreign key to the Doctor table'; COMMENT ON COLUMN "doctor_unavailability"."start_time" IS 'Start time of the unavailability period'; COMMENT ON COLUMN "doctor_unavailability"."end_time" IS 'End time of the unavailability period'; COMMENT ON COLUMN "doctor_unavailability"."reason" IS 'Reason for unavailability'; COMMENT ON COLUMN "doctor_unavailability"."created_at" IS 'Timestamp of the record creation'; COMMENT ON COLUMN "doctor_unavailability"."updated_at" IS 'Timestamp of the last record update'; COMMENT ON COLUMN "doctor_unavailability"."deleted_at" IS 'Soft deletion timestamp'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bd625968b617ca445ad3087afb" ON "doctor_unavailability" ("doctor_id", "start_time", "end_time") `,
    );
    await queryRunner.query(
      `CREATE TABLE "doctor_availability" ("id" SERIAL NOT NULL, "doctor_id" integer NOT NULL, "start_time" TIMESTAMP WITH TIME ZONE NOT NULL, "end_time" TIMESTAMP WITH TIME ZONE NOT NULL, "is_recurring" boolean NOT NULL DEFAULT false, "day_of_week" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_3d2b4ffe9085f8c7f9f269aed89" PRIMARY KEY ("id")); COMMENT ON COLUMN "doctor_availability"."doctor_id" IS 'Foreign key to the Doctor table'; COMMENT ON COLUMN "doctor_availability"."start_time" IS 'Start time of the availability period'; COMMENT ON COLUMN "doctor_availability"."end_time" IS 'End time of the availability period'; COMMENT ON COLUMN "doctor_availability"."is_recurring" IS 'Indicates if this availability is recurring'; COMMENT ON COLUMN "doctor_availability"."day_of_week" IS 'Day of the week (0=Sunday, 6=Saturday) for recurring availability'; COMMENT ON COLUMN "doctor_availability"."created_at" IS 'Timestamp of the record creation'; COMMENT ON COLUMN "doctor_availability"."updated_at" IS 'Timestamp of the last record update'; COMMENT ON COLUMN "doctor_availability"."deleted_at" IS 'Soft deletion timestamp'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0e3c58360b68b56e2aabd656da" ON "doctor_availability" ("doctor_id", "start_time", "end_time") `,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_unavailability" ADD CONSTRAINT "FK_e78f9cad45dc9e6fa6529f6e815" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_availability" ADD CONSTRAINT "FK_2cc8d37cdcb4ecd1e726d6ed304" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "doctor_availability" DROP CONSTRAINT "FK_2cc8d37cdcb4ecd1e726d6ed304"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_unavailability" DROP CONSTRAINT "FK_e78f9cad45dc9e6fa6529f6e815"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0e3c58360b68b56e2aabd656da"`,
    );
    await queryRunner.query(`DROP TABLE "doctor_availability"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bd625968b617ca445ad3087afb"`,
    );
    await queryRunner.query(`DROP TABLE "doctor_unavailability"`);
  }
}
