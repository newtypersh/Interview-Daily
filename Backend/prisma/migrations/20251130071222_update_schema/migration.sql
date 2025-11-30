/*
  Warnings:

  - You are about to drop the column `question_set_id` on the `feedback` table. All the data in the column will be lost.
  - You are about to drop the column `mode` on the `interview` table. All the data in the column will be lost.
  - You are about to drop the column `question_set_id` on the `interviewAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `enabled` on the `question` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,day]` on the table `interview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `question_id` to the `feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `day` to the `interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_id` to the `interviewAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `feedback_interview_answer_id_fkey`;

-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `feedback_question_set_id_fkey`;

-- DropForeignKey
ALTER TABLE `feedbackTemplate` DROP FOREIGN KEY `feedbackTemplate_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `interview` DROP FOREIGN KEY `interview_question_set_id_fkey`;

-- DropForeignKey
ALTER TABLE `interview` DROP FOREIGN KEY `interview_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `interviewAnswer` DROP FOREIGN KEY `interviewAnswer_interview_id_fkey`;

-- DropForeignKey
ALTER TABLE `interviewAnswer` DROP FOREIGN KEY `interviewAnswer_question_set_id_fkey`;

-- DropForeignKey
ALTER TABLE `question` DROP FOREIGN KEY `question_question_set_id_fkey`;

-- DropForeignKey
ALTER TABLE `questionSet` DROP FOREIGN KEY `questionSet_user_id_fkey`;

-- DropIndex
DROP INDEX `feedback_question_set_id_idx` ON `feedback`;

-- DropIndex
DROP INDEX `interviewAnswer_question_set_id_idx` ON `interviewAnswer`;

-- AlterTable
ALTER TABLE `feedback` DROP COLUMN `question_set_id`,
    ADD COLUMN `question_id` BIGINT NOT NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `feedbackTemplate` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `interview` DROP COLUMN `mode`,
    ADD COLUMN `day` DATETIME(3) NOT NULL,
    ADD COLUMN `status` ENUM('IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'IN_PROGRESS',
    MODIFY `interviewed_at` DATETIME(3) NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `interviewAnswer` DROP COLUMN `question_set_id`,
    ADD COLUMN `question_id` BIGINT NOT NULL,
    ADD COLUMN `transcript_text` TEXT NULL,
    MODIFY `audio_url` VARCHAR(256) NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `question` DROP COLUMN `enabled`,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `questionSet` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user` MODIFY `email` VARCHAR(255) NOT NULL,
    MODIFY `name` VARCHAR(64) NOT NULL;

-- CreateIndex
CREATE INDEX `feedback_question_id_idx` ON `feedback`(`question_id`);

-- CreateIndex
CREATE INDEX `feedbackTemplate_user_id_category_idx` ON `feedbackTemplate`(`user_id`, `category`);

-- CreateIndex
CREATE UNIQUE INDEX `interview_user_id_day_key` ON `interview`(`user_id`, `day`);

-- CreateIndex
CREATE INDEX `interviewAnswer_question_id_idx` ON `interviewAnswer`(`question_id`);

-- CreateIndex
CREATE UNIQUE INDEX `user_email_key` ON `user`(`email`);

-- AddForeignKey
ALTER TABLE `interview` ADD CONSTRAINT `fk_interview_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `interview` ADD CONSTRAINT `fk_interview_questionSet` FOREIGN KEY (`question_set_id`) REFERENCES `questionSet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `interviewAnswer` ADD CONSTRAINT `fk_interviewAnswer_interview` FOREIGN KEY (`interview_id`) REFERENCES `interview`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `interviewAnswer` ADD CONSTRAINT `fk_interviewAnswer_question` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questionSet` ADD CONSTRAINT `fk_questionSet_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question` ADD CONSTRAINT `fk_question_questionSet` FOREIGN KEY (`question_set_id`) REFERENCES `questionSet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedback` ADD CONSTRAINT `fk_feedback_interviewAnswer` FOREIGN KEY (`interview_answer_id`) REFERENCES `interviewAnswer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedback` ADD CONSTRAINT `fk_feedback_question` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedbackTemplate` ADD CONSTRAINT `fk_feedbackTemplate_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
