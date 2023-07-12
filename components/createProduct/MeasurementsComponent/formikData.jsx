import * as Yup from 'yup';

const MeasurementsValidationSchema = Yup.object().shape({
  measurements: Yup.array().of(
    Yup.object().shape({
      firstValue: Yup.string().when(['oneRangeEnabled', 'twoRangeEnabled', 'manuelDefined'], {
        // 1. Senaryo: oneRangeEnabled true, twoRangeEnabled false, manuelDefined false
        is: (oneRangeEnabled, twoRangeEnabled, manuelDefined) => oneRangeEnabled && !twoRangeEnabled && !manuelDefined,
        then: Yup.string().required('Ölçü değeri boş bırakılamaz!').nullable(false),
        otherwise: Yup.string().notRequired().nullable(true),
      }).test('console-log', 'firstValue validation', function (value) {
        // Test fonksiyonu, değeri kontrol etmek için kullanılır ve geçerli ise true döndürür.
        // Bu örnekte, sadece console'a firstValue'nun validasyon değerini yazdırıyoruz.
        console.log('firstValue validation:', value);
        return true;
      }),

      secondValue: Yup.string().when(['oneRangeEnabled', 'twoRangeEnabled', 'manuelDefined'], {
        // 2. Senaryo: oneRangeEnabled false, twoRangeEnabled true, manuelDefined false
        is: (oneRangeEnabled, twoRangeEnabled, manuelDefined) => !oneRangeEnabled && twoRangeEnabled && !manuelDefined,
        then: Yup.string().required('Ölçü değeri boş bırakılamaz!').nullable(false),
        otherwise: Yup.string().notRequired().nullable(true),
      }).test('console-log', 'secondValue validation', function (value) {
        // Test fonksiyonu, değeri kontrol etmek için kullanılır ve geçerli ise true döndürür.
        // Bu örnekte, sadece console'a secondValue'nun validasyon değerini yazdırıyoruz.
        console.log('secondValue validation:', value);
        return true;
      }),

      unit: Yup.string().when(['oneRangeEnabled', 'twoRangeEnabled', 'manuelDefined'], {
        // 3. Senaryo: oneRangeEnabled true, twoRangeEnabled false, manuelDefined false
        is: (oneRangeEnabled, twoRangeEnabled, manuelDefined) => oneRangeEnabled && !twoRangeEnabled && !manuelDefined,
        then: Yup.string().required('Ölçü birimi boş bırakılamaz!').oneOf(['m', 'cm', 'mm']),
        otherwise: Yup.string().notRequired(),
      }).test('console-log', 'unit validation', function (value) {
        // Test fonksiyonu, değeri kontrol etmek için kullanılır ve geçerli ise true döndürür.
        // Bu örnekte, sadece console'a unit'in validasyon değerini yazdırıyoruz.
        console.log('unit validation:', value);
        return true;
      }),

      turkish: Yup.string().when(['oneRangeEnabled', 'twoRangeEnabled', 'manuelDefined'], {
        // 1. Senaryo: oneRangeEnabled true, twoRangeEnabled false, manuelDefined false
        is: (oneRangeEnabled, twoRangeEnabled, manuelDefined) => oneRangeEnabled && !twoRangeEnabled && !manuelDefined,
        then: Yup.string().notRequired(),
        otherwise: Yup.string().required('Türkçe değeri boş bırakılamaz!'),
      }).test('console-log', 'turkish validation', function (value) {
        // Test fonksiyonu, değeri kontrol etmek için kullanılır ve geçerli ise true döndürür.
        // Bu örnekte, sadece console'a turkish'ın validasyon değerini yazdırıyoruz.
        console.log('turkish validation:', value);
        return true;
      }),

      ukrainian: Yup.string().when(['oneRangeEnabled', 'twoRangeEnabled', 'manuelDefined'], {
        // 1. Senaryo: oneRangeEnabled true, twoRangeEnabled false, manuelDefined false
        is: (oneRangeEnabled, twoRangeEnabled, manuelDefined) => oneRangeEnabled && !twoRangeEnabled && !manuelDefined,
        then: Yup.string().notRequired(),
        otherwise: Yup.string().required('Ukrayna dili değeri boş bırakılamaz!'),
      }).test('console-log', 'ukrainian validation', function (value) {
        // Test fonksiyonu, değeri kontrol etmek için kullanılır ve geçerli ise true döndürür.
        // Bu örnekte, sadece console'a ukrainian'ın validasyon değerini yazdırıyoruz.
        console.log('ukrainian validation:', value);
        return true;
      }),

      english: Yup.string().when(['oneRangeEnabled', 'twoRangeEnabled', 'manuelDefined'], {
        // 1. Senaryo: oneRangeEnabled true, twoRangeEnabled false, manuelDefined false
        is: (oneRangeEnabled, twoRangeEnabled, manuelDefined) => oneRangeEnabled && !twoRangeEnabled && !manuelDefined,
        then: Yup.string().notRequired(),
        otherwise: Yup.string().required('İngilizce değeri boş bırakılamaz!'),
      }).test('console-log', 'english validation', function (value) {
        // Test fonksiyonu, değeri kontrol etmek için kullanılır ve geçerli ise true döndürür.
        // Bu örnekte, sadece console'a english'in validasyon değerini yazdırıyoruz.
        console.log('english validation:', value);
        return true;
      }),
    })
  ),
});

export default MeasurementsValidationSchema;
