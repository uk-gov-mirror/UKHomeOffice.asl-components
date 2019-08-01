import React, { Fragment } from 'react';
import { Snippet } from '../';
import differenceInMonths from 'date-fns/difference_in_calendar_months';
import differenceInWeeks from 'date-fns/difference_in_calendar_weeks';
import differenceInDays from 'date-fns/difference_in_calendar_days';
import format from 'date-fns/format';
import classnames from 'classnames';

const ExpiryDate = ({
  date,
  dateFormat,
  unit = 'month',
  adjustment = 0,
  showUrgent = 3,
  showNotice = 11
}) => {
  if (!date) {
    return null;
  }

  let differenceFunction;
  switch (unit) {
    case 'month':
      differenceFunction = differenceInMonths;
      break;
    case 'week':
      differenceFunction = differenceInWeeks;
      break;
    case 'day':
      differenceFunction = differenceInDays;
      break;
  }
  const diff = differenceFunction(date, new Date()) + adjustment;
  const urgent = diff < showUrgent;

  let contentKey = 'diff.standard';

  if (diff <= 0) {
    contentKey = 'diff.expired';
  } else if (urgent) {
    contentKey = diff === 1 ? 'diff.singular' : 'diff.plural';
  }

  return (
    <Fragment>
      {format(date, dateFormat)}
      {diff <= showNotice && (
        <span className={classnames('notice', { urgent })}>
          <Snippet diff={diff} unit={unit}>{contentKey}</Snippet>
        </span>
      )}
    </Fragment>
  );
};

ExpiryDate.defaultProps = {
  dateFormat: 'DD MMMM YYYY'
};

export default ExpiryDate;
