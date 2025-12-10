"use client";
import { useActionState } from 'react';
import { createReview, ReviewState } from '@/app/lib/actions';
import { Id } from '@/types/types';

export default function ReviewForm({prodId}: {prodId: Id}) {
  const initialState: ReviewState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createReview, initialState);
  // TODO: display errors from state
  console.warn('TODO: display errors from state:', state);
  return (
    <form action={formAction} className="p-review-form" style={{ marginTop: 12 }}>
      <div>
        <label htmlFor="rev-rating" className='sr-only'>Rating of product:</label>
        <select
          id='rev-rating'
          name='rating'
          defaultValue={5}
          aria-label="Rating"
          className="p-select"
          style={{ marginBottom: 8 }}
        >
          <option value={5}>5 - Excellent</option>
          <option value={4}>4 - Good</option>
          <option value={3}>3 - Okay</option>
          <option value={2}>2 - Poor</option>
          <option value={1}>1 - Terrible</option>
        </select>

        <label htmlFor="rev-title" className='sr-only'>Title of review:</label>
        <input id='rev-title' name='title' type="text" />

        <label htmlFor="rev-content" className='sr-only'>Written portion of review:</label>
        <textarea
          id='rev-content'
          name='content'
          rows={4}
          placeholder="This product..."
          className="p-textarea"
          aria-label="Write your review"
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input type="hidden" name='product' value={prodId} />
        <input type="hidden" name='reviewer' value={0} />
        <button type="submit" className="p-btn p-btn-primary" style={{ background: '#16a34a' }}>Submit review</button>
        <div style={{ color: '#6b7280', fontSize: 13 }}>Reviews help others discover artisanal makers.</div>
      </div>
    </form>
  );
}