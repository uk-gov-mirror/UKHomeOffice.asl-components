import React, { Fragment, useState } from 'react';
import { Snippet, Fieldset } from '../';

const Form = ({
  csrfToken,
  className,
  submit = true,
  children,
  detachFields,
  schema,
  onSubmit = () => {},
  ...props
}) => {

  const [disabled, setDisabled] = useState(false);
  const onFormSubmit = e => {
    if (disabled) {
      e.preventDefault();
    }
    e.persist();
    onSubmit(e);
    setTimeout(() => setDisabled(true), 0);
  };

  const formFields = (
    <Fragment>
      <Fieldset schema={schema} { ...props } />
      {
        submit && <button type="submit" className="govuk-button" disabled={disabled}><Snippet>buttons.submit</Snippet></button>
      }
    </Fragment>
  );

  return (
    <form
      method="POST"
      noValidate
      className={className}
      onSubmit={onFormSubmit}
      encType={Object.values(schema).map(s => s.inputType).includes('inputFile') ? 'multipart/form-data' : null}
    >
      <input type="hidden" name="_csrf" value={csrfToken} />
      {
        detachFields
          ? React.Children.map(children, child =>
            React.cloneElement(child, { formFields })
          )
          : children
      }
      {
        !detachFields && formFields
      }
    </form>
  );
};

export default Form;
