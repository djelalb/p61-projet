import { useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme, Text } from 'react-native-paper';

import CalendarStrip from 'react-native-calendar-strip';

import 'moment';
import 'moment/locale/fr';

export default Calendar = ({ onDateSelected }) => {
  const calendarRef = useRef();
  const theme = useTheme();

  const initialDate = new Date();

  return (
    <View>
      <CalendarStrip
        scrollable
        onDateSelected={onDateSelected}
        showMonth={true}
        leftSelector={[]}
        rightSelector={[]}
        calendarHeaderStyle={{ color: theme.colors.onBackground }}
        locale={{
          name: 'fr',
          config: {
            months: 'Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Août_Septembre_Octobre_Novembre_Décembre'.split('_'),
            monthsShort: 'Janv_Févr_Mars_Avr_Mai_Juin_Juil_Août_Sept_Oct_Nov_Déc'.split('_'),
            weekdays: 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
            weekdaysShort: 'Dim_Lun_Mar_Mer_Jeu_Ven_Sam'.split('_'),
            weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
            longDateFormat: {
              LT: 'HH:mm',
              LTS: 'HH:mm:ss',
              L: 'DD/MM/YYYY',
              LL: 'D MMMM YYYY',
              LLL: 'D MMMM YYYY LT',
              LLLL: 'dddd D MMMM YYYY LT',
            },
            calendar: {
              sameDay: "[Aujourd'hui à] LT",
              nextDay: '[Demain à] LT',
              nextWeek: 'dddd [à] LT',
              lastDay: '[Hier à] LT',
              lastWeek: 'dddd [dernier à] LT',
              sameElse: 'L',
            },
            relativeTime: {
              future: 'dans %s',
              past: 'il y a %s',
              s: 'quelques secondes',
              m: 'une minute',
              mm: '%d minutes',
              h: 'une heure',
              hh: '%d heures',
              d: 'un jour',
              dd: '%d jours',
              M: 'un mois',
              MM: '%d mois',
              y: 'une année',
              yy: '%d années',
            },
            ordinalParse: /\d{1,2}(er|ème)/,
            ordinal: function (number) {
              return number + (number === 1 ? 'er' : 'ème');
            },
            meridiemParse: /PD|MD/,
            isPM: function (input) {
              return input.charAt(0) === 'M';
            },
            // in case the meridiem units are not separated around 12, then implement
            // this function (look at locale/id.js for an example)
            // meridiemHour : function (hour, meridiem) {
            //     return /* 0-23 hour, given meridiem token and hour 1-12 */
            // },
            meridiem: function (hours, minutes, isLower) {
              return hours < 12 ? 'PD' : 'MD';
            },
            week: {
              dow: 1, // Monday is the first day of the week.
              doy: 4, // The week that contains Jan 4th is the first week of the year.
            },
          },
        }}
        selectedDate={initialDate}
        ref={calendarRef}
        dayComponent={({ selected, date }) => (
          <Day date={date} selected={selected} onSelect={() => calendarRef.current.setSelectedDate(date)} />
        )}
        style={{ height: 120 }}
        dayComponentHeight={70}
      />
    </View>
  );
};

const Day = ({ date, onSelect, selected }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={{
        backgroundColor: selected ? theme.colors.primaryContainer : 'transparent',
        ...styles.day,
      }}
      onPress={() => onSelect(date)}
    >
      <Text
        style={{
          color: selected ? 'white' : theme.colors.secondary,
          ...styles.dayOfWeek,
        }}
      >
        {date.format('ddd')}
      </Text>
      <Text
        style={{
          color: selected ? theme.colors.primary : theme.colors.secondary,
          backgroundColor: selected ? theme.colors.onPrimary : theme.colors.primaryContainer,
          ...styles.dayOfMonth,
        }}
      >
        {date.format('DD')}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  day: {
    height: 70,
    padding: 5,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  dayOfWeek: {
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: 10,
  },
  dayOfMonth: {
    fontSize: 15,
    fontWeight: 'bold',
    borderRadius: 50,
    width: 30,
    height: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
