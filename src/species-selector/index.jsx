import React, { useState } from 'react';
import uniq from 'lodash/uniq';
import map from 'lodash/map';
import partition from 'lodash/partition';
import values from 'lodash/values';
import flatten from 'lodash/flatten';
import omit from 'lodash/omit';
import intersection from 'lodash/intersection';
import without from 'lodash/without';
import { InputWrapper } from '@ukhomeoffice/react-components';
import { MultiInput, Fieldset } from '../';
import PIL_GROUPS from './species';
import { projectSpecies as PROJECT_GROUPS } from '@asl/constants';

const GROUP_LABELS = {
  SA: 'Small animals',
  LA: 'Large animals',
  AQ: 'Fish, reptiles and aquatic species',
  AV: 'Birds',
  DOM: 'Cats, dogs and equidae',
  NHP: 'Non-human primates'
};

const ALL_PIL_SPECIES = flatten(values(PIL_GROUPS).map(g => g.types));

export default function SpeciesSelector(props) {
  const presets = props.presets || [];
  const species = props.projectSpecies ? omit(PROJECT_GROUPS, 'deprecated') : PIL_GROUPS;
  let val = props.value;

  if (!props.projectSpecies) {
    const parts = partition(val, s => ALL_PIL_SPECIES.includes(s));
    val = {
      precoded: parts[0],
      otherSpecies: parts[1]
    };
  }

  const INITIAL_STATE = {
    precoded: [],
    otherSpecies: []
  };

  const [value, setValue] = useState(val || INITIAL_STATE);

  function onOtherChange(otherSpecies) {
    setValue({ ...value, otherSpecies });
  }

  function mapOptions(option) {
    if (typeof option === 'string') {
      option = {
        value: option,
        label: option
      };
    }
    if (option.value.includes('other')) {
      const fieldName = `${props.name}-${option.value}`;
      return {
        ...option,
        reveal: {
          [fieldName]: {
            inputType: 'multiInput',
            onFieldChange: vals => {
              setValue({
                ...value,
                [fieldName]: vals
              });
            },
            value: []
          }
        }
      };
    }
    return {
      ...option,
      disabled: presets.includes(option.value)
    };
  }

  const onGroupChange = name => val => {
    const nopes = props.projectSpecies
      ? (species[name] || []).map(o => o.value)
      : (species[name].types || []);
    const v = uniq(value.precoded.filter(item => !nopes.includes(item)).concat(val[`_${props.name}`]));
    setValue({
      ...value,
      // eslint-disable-next-line no-useless-call
      precoded: without.apply(null, [ v, ...presets ])
    });
  };

  function getField(options, key) {
    return <Fieldset
      model={{
        ...value,
        [`_${props.name}`]: [
          ...presets,
          ...value.precoded
        ]
      }}
      onChange={onGroupChange(key)}
      schema={{
        [`_${props.name}`]: {
          inputType: 'checkboxGroup',
          automapReveals: true,
          label: false,
          options: options.map(mapOptions)
        }
      }}
    />;
  }

  function getValue() {
    if (props.projectSpecies) {
      return JSON.stringify(value);
    }
    return JSON.stringify([
      ...value.precoded,
      ...value.otherSpecies
    ]);
  }

  return (
    <div className="species-selector">
      <InputWrapper {...props}>
        {
          map(species, (group, key) => {
            const options = group.types || group;
            return (
              <details key={key} open={intersection(options.map(opt => opt.value || opt), [...presets, ...value.precoded]).length}>
                <summary>{GROUP_LABELS[key]}</summary>
                { getField(options, key) }
              </details>
            );
          })
        }
        <details open={value.otherSpecies.length}>
          <summary>Other</summary>
          <MultiInput
            value={value.otherSpecies}
            onChange={onOtherChange}
          />
        </details>
        <input type="hidden" name={props.name} value={getValue()} />
      </InputWrapper>
    </div>
  );
}

SpeciesSelector.defaultProps = {
  value: {
    precoded: [],
    otherSpecies: []
  }
};
