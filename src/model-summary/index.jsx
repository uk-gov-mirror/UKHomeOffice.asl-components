import classnames from 'classnames';
import React, { Fragment } from 'react';
import map from 'lodash/map';
import pick from 'lodash/pick';
import size from 'lodash/size';
import { connect } from 'react-redux';
import { Snippet } from '../';

const getValue = (value, format, model) => {
  if (!value) {
    return '-';
  }
  return format ? format(value, model) : value;
};

const ModelSummary = ({ model, schema, formatters = {}, className }) => {
  if (size(schema)) {
    model = pick(model, Object.keys(schema));
  }
  return (
    <dl className={classnames('model-summary', 'inline', className)}>
      {
        map(model, (item, key) =>
          <Fragment key={key}>
            <dt><Snippet>{`fields.${key}.label`}</Snippet></dt>
            <dd>{getValue(model[key], formatters[key] && formatters[key].format, model)}</dd>
          </Fragment>
        )
      }
    </dl>
  );
};

const mapStateToProps = ({ model, static: { schema } }, { formatters, schema: ownSchema, model: ownModel }) => ({
  model: ownModel || model,
  schema: ownSchema || schema,
  formatters
});

export default connect(mapStateToProps)(ModelSummary);
