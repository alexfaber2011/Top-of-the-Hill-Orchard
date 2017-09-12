const expect = require('chai').expect;
const { useExifAngle } = require('./imageService');

describe('Image Service', () => {
  describe('useExifAngle', () => {
    it('should not add exif angle usage to a https url', () => {
      const exampleUrl = 'https://res.cloudinary.com/anzaborrego/image/upload/v1505141187/top-of-the-hill-orchard/landing-page-photos/image/lrrvehky6xkfcnu9ej3l.jpg';
      const actualResult = useExifAngle(exampleUrl);
      expect(actualResult).to.not.have.string('a_exif');
    });

    it('should not add exif angle usage to a http url', () => {
      const exampleUrl = 'http://res.cloudinary.com/anzaborrego/image/upload/v1505141187/top-of-the-hill-orchard/landing-page-photos/image/lrrvehky6xkfcnu9ej3l.jpg';
      const actualResult = useExifAngle(exampleUrl);
      expect(actualResult).to.not.have.string('a_exif');
    });

    it('should add exif angle usage to a "minimal" url', () => {
      const exampleUrl = 'top-of-the-hill-orchard/landing-page-photos/image/lrrvehky6xkfcnu9ej3l.jpg';
      const actualResult = useExifAngle(exampleUrl)
      expect(actualResult).to.have.string('a_exif');
    })
  });
});
