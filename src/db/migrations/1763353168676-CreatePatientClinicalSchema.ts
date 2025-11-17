import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePatientClinicalSchema1763353168676
  implements MigrationInterface
{
  name = 'CreatePatientClinicalSchema1763353168676';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."patient_gender_enum" AS ENUM('MALE', 'FEMALE', 'OTHER', 'PREFERS_NOT_TO-SAY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "patient" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "person_id" integer NOT NULL, "birth_date" date NOT NULL, "medical_history" text, "allergic_reactions" text, "current_systemic_treatment" text, "lab_results" text, "complete_odontogram" boolean, "gender" "public"."patient_gender_enum" NOT NULL, "phone" character varying(50), "address" character varying(255), "occupation" character varying(100), "has_snc_issues" boolean NOT NULL DEFAULT false, "has_svc_issues" boolean NOT NULL DEFAULT false, "has_se_issues" boolean NOT NULL DEFAULT false, "has_sme_issues" boolean NOT NULL DEFAULT false, "has_sr_issues" boolean NOT NULL DEFAULT false, "has_su_issues" boolean NOT NULL DEFAULT false, "has_sgu_issues" boolean NOT NULL DEFAULT false, "has_sgi_issues" boolean NOT NULL DEFAULT false, "system_evaluation_notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_b829cf7046dfb9d4e510984e977" UNIQUE ("person_id"), CONSTRAINT "REL_b829cf7046dfb9d4e510984e97" UNIQUE ("person_id"), CONSTRAINT "PK_8dfa510bb29ad31ab2139fbfb99" PRIMARY KEY ("id")); COMMENT ON COLUMN "patient"."person_id" IS 'Foreign key to the Person table'; COMMENT ON COLUMN "patient"."birth_date" IS 'Patient''s date of birth'; COMMENT ON COLUMN "patient"."medical_history" IS 'General medical history'; COMMENT ON COLUMN "patient"."allergic_reactions" IS 'Known allergic reactions'; COMMENT ON COLUMN "patient"."current_systemic_treatment" IS 'Current systemic treatment and medications'; COMMENT ON COLUMN "patient"."lab_results" IS 'Laboratory results details'; COMMENT ON COLUMN "patient"."complete_odontogram" IS 'Status of the complete odontogram chart'; COMMENT ON COLUMN "patient"."gender" IS 'Patient''s gender'; COMMENT ON COLUMN "patient"."phone" IS 'Contact phone number'; COMMENT ON COLUMN "patient"."address" IS 'Patient''s home address'; COMMENT ON COLUMN "patient"."occupation" IS 'Patient''s occupation'; COMMENT ON COLUMN "patient"."has_snc_issues" IS 'Central Nervous System issues (SNC)'; COMMENT ON COLUMN "patient"."has_svc_issues" IS 'Vascular System issues (SVC)'; COMMENT ON COLUMN "patient"."has_se_issues" IS 'Endocrine System issues (SE)'; COMMENT ON COLUMN "patient"."has_sme_issues" IS 'Musculoskeletal System issues (SME)'; COMMENT ON COLUMN "patient"."has_sr_issues" IS 'Respiratory System issues (SR)'; COMMENT ON COLUMN "patient"."has_su_issues" IS 'Urinary System issues (SU)'; COMMENT ON COLUMN "patient"."has_sgu_issues" IS 'Genitourinary System issues (SGU)'; COMMENT ON COLUMN "patient"."has_sgi_issues" IS 'Gastrointestinal System issues (SGI)'; COMMENT ON COLUMN "patient"."system_evaluation_notes" IS 'Consolidated notes on systemic evaluation'; COMMENT ON COLUMN "patient"."created_at" IS 'Timestamp of the record creation'; COMMENT ON COLUMN "patient"."updated_at" IS 'Timestamp of the last record update'; COMMENT ON COLUMN "patient"."deleted_at" IS 'Soft deletion timestamp'`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD CONSTRAINT "FK_b829cf7046dfb9d4e510984e977" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient" DROP CONSTRAINT "FK_b829cf7046dfb9d4e510984e977"`,
    );
    await queryRunner.query(`DROP TABLE "patient"`);
    await queryRunner.query(`DROP TYPE "public"."patient_gender_enum"`);
  }
}
