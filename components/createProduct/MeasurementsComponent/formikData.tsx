import * as Yup from 'yup';

const MeasurementsValidationSchema = Yup.object().shape({
  measurements: Yup.array().of(
    Yup.object().shape({
      firstValue: Yup.string().required('firstValue is required'),
      secondValue: Yup.number().required('secondValue is required'),
    })
  ),
});

export default MeasurementsValidationSchema;
