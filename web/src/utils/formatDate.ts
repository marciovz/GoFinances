import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

const formatDate = (date: string): string => {
  try {
    const dateFormatted = format(parseISO(date), "dd'/'MM'/'yyyy", {
      locale: pt,
    });

    return dateFormatted;
  } catch (err) {
    return '--/--/--';
  }
};

export default formatDate;
