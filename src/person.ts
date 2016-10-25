interface Person {
  name: string;
  mom: Person;
  dad?: Person;
  spouse: Person | null;
  children: Person[];
  shoe_size: 7 | 8 | 9 | 10 | 11 | 12;
  race: 'human';

  x: () => void;
}