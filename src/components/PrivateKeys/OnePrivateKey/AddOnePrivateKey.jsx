import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAxiosGet from '../../../hooks/useAxiosGet';
import useAxiosSend from '../../../hooks/useAxiosSend';
import { isNameValid } from '../../../helpers/form-validation';
import { newId } from '../../../helpers/constants';

import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import Button from '../../UI/Button/Button';
import InputSelect from '../../UI/FormMui/InputSelect';
import Form from '../../UI/FormMui/Form';
import FormContainer from '../../UI/FormMui/FormContainer';
import FormError from '../../UI/FormMui/FormError';
import FormFooter from '../../UI/FormMui/FormFooter';
import InputCheckbox from '../../UI/FormMui/InputCheckbox';
import InputTextArea from '../../UI/FormMui/InputTextArea';
import InputTextField from '../../UI/FormMui/InputTextField';
import TitleBar from '../../UI/TitleBar/TitleBar';

const keySources = [
  {
    value: 0,
    name: 'Generate',
  },
  {
    value: 1,
    name: 'Paste PEM',
  },
];

const AddOnePrivateKey = () => {
  // fetch valid options (for private keys this is the algorithms list)
  const [apiGetState] = useAxiosGet(
    `/v1/privatekeys/${newId}`,
    'private_key_options',
    true
  );

  const [apiSendState, sendData] = useAxiosSend();
  const navigate = useNavigate();

  const emptyForm = {
    key_source: '',
    form: {
      name: '',
      description: '',
      algorithm_value: '',
      pem: '',
      api_key_disabled: false,
    },
    validationErrors: {},
  };
  const [formState, setFormState] = useState(emptyForm);

  // data change handler
  const inputChangeHandler = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      form: {
        ...prevState.form,
        [event.target.name]: event.target.value,
      },
    }));
  };
  // checkbox updates
  const checkChangeHandler = (event) => {
    setFormState((prevState) => {
      return {
        ...prevState,
        form: {
          ...prevState.form,
          [event.target.name]: event.target.checked,
        },
      };
    });
  };

  // on key change, clear out alg value and pem also
  const keySourceChangeHandler = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      key_source: event.target.value,
      form: {
        ...prevState.form,
        algorithm_value: '',
        pem: '',
      },
    }));
  };

  // button handlers
  const resetClickHandler = (event) => {
    event.preventDefault();
    setFormState(emptyForm);
  };
  const cancelClickHandler = (event) => {
    event.preventDefault();

    navigate(-1);
  };

  // form submission handler
  const submitFormHandler = (event) => {
    event.preventDefault();

    /// form validation
    let validationErrors = {};
    // name
    if (!isNameValid(formState.form.name)) {
      validationErrors.name = true;
    }

    // ensure algo or pem
    if (formState.key_source === '') {
      validationErrors.key_source = true;
    }

    // if algo, confirm selected
    if (formState.key_source === 0 && formState.form.algorithm_value === '') {
      validationErrors.algorithm_value = true;
    }

    setFormState((prevState) => ({
      ...prevState,
      validationErrors: validationErrors,
    }));
    if (Object.keys(validationErrors).length > 0) {
      return false;
    }
    //

    sendData(`/v1/privatekeys`, 'POST', formState.form, true).then(
      (response) => {
        if (response.status >= 200 && response.status <= 299) {
          // back to the private keys page
          navigate(`/privatekeys/${response.data?.response?.record_id}`);
        }
      }
    );
  };

  // consts related to rendering
  const renderApiItems = apiGetState.isLoaded && !apiGetState.errorMessage;

  return (
    <FormContainer>
      <TitleBar title='New Private Key' />

      {!apiGetState.isLoaded && <ApiLoading />}
      {apiGetState.errorMessage && (
        <ApiError>{apiGetState.errorMessage}</ApiError>
      )}

      {renderApiItems && (
        <Form onSubmit={submitFormHandler}>
          <InputTextField
            label='Name'
            id='name'
            value={formState.form.name}
            onChange={inputChangeHandler}
            error={formState.validationErrors.name && true}
          />

          <InputTextField
            label='Description'
            id='description'
            value={formState.form.description}
            onChange={inputChangeHandler}
          />

          <InputSelect
            label='Key Source'
            id='key_source'
            options={keySources}
            value={formState.key_source}
            onChange={keySourceChangeHandler}
            error={formState.validationErrors.key_source && true}
          />

          {formState.key_source === 0 && (
            <InputSelect
              label='Key Generation Algorithm'
              id='algorithm_value'
              options={apiGetState.private_key_options.key_algorithms}
              value={formState.form.algorithm_value}
              onChange={inputChangeHandler}
              error={formState.validationErrors.algorithm_value && true}
            />
          )}

          {formState.key_source === 1 && (
            <InputTextArea
              label='PEM Content'
              id='pem'
              value={formState.form.pem}
              onChange={inputChangeHandler}
              invalid={formState.validationErrors.pem && true}
            />
          )}

          <InputCheckbox
            id='api_key_disabled'
            checked={formState.form.api_key_disabled}
            onChange={checkChangeHandler}
          >
            Disable API Key
          </InputCheckbox>

          {apiSendState.errorMessage &&
            Object.keys(formState.validationErrors).length <= 0 && (
              <FormError>
                Error Sending -- {apiSendState.errorMessage}
              </FormError>
            )}

          <FormFooter>
            <Button
              type='cancel'
              onClick={cancelClickHandler}
              disabled={apiSendState.isSending}
            >
              Cancel
            </Button>
            <Button
              type='reset'
              onClick={resetClickHandler}
              disabled={apiSendState.isSending}
            >
              Reset
            </Button>
            <Button type='submit' disabled={apiSendState.isSending}>
              Submit
            </Button>
          </FormFooter>
        </Form>
      )}
    </FormContainer>
  );
};

export default AddOnePrivateKey;
