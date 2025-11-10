'use client';

import { createNote } from "@/lib/api";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateNotePayload } from "@/lib/api";
import type { CreateNoteDto, NoteTag } from '@/types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onSuccess: (payload: CreateNotePayload) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  errorMsg?: string;
}

const TAG_OPTIONS: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

const Schema = Yup.object({
  title: Yup.string().required('Title is required'),
  content: Yup.string().max(500, 'Max 500 characters'),
  tag: Yup.mixed<NoteTag>().oneOf(TAG_OPTIONS, 'Invalid tag').required('Tag is required'),
});

type FormValues = {
  title: string;
  content: string;
  tag: NoteTag | '';
};

const initialValues: FormValues = {
  title: '',
  content: '',
  tag: '',
};

export default function NoteForm({ onCancel, onSuccess }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (dto: CreateNotePayload) => createNote(dto),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      onSuccess?.(variables);
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Schema}
      onSubmit={(values, { resetForm }) => {
        const payload: CreateNoteDto = {
          title: values.title,
          content: values.content,
          tag: values.tag as NoteTag,
        };
        mutation.mutate(payload, {
          onSuccess: () => {
            resetForm();
          },
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" className={css.input} />
            <ErrorMessage name="title" component="div" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field id="content" as="textarea" name="content" className={css.textarea} />
            <ErrorMessage name="content" component="div" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field id="tag" as="select" name="tag" className={css.select}>
              <option value="" disabled>
                Select tag
              </option>
              {TAG_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tag" component="div" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
              disabled={mutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || mutation.isPending}
            >
              {mutation.isPending ? 'Creating...' : 'Create note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}