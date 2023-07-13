import * as Yup from 'yup';

const MeasurementsValidationSchema = Yup.object().shape({
  measurements: Yup.array().of(
    Yup.object().shape({
      firstValue: Yup.string().required('firstValue is required'),
    })
  ),
});

export default MeasurementsValidationSchema;