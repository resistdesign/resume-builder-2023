import { Skill } from '../../Types/Skill';

const getSkillTableHeader = () => {
  const description = 'Description';
  const rating = 'Rating';

  return `| ${description} | ${rating} |
| --- | --- |`;
};

const getStarRating = (rating: number) => {
  const star = '★';
  const emptyStar = '☆';
  const maxRating = 5;
  const maxStars = 5;

  const fullStars = Math.round((rating / maxRating) * maxStars);
  const emptyStars = maxStars - fullStars;

  return `${star.repeat(fullStars)}${emptyStar.repeat(emptyStars)}`;
};

export const mdSkill = ({ description = '', rating = 0 }: Skill = {} as Skill) =>
  // A markdown table row.
  `| ${description} | ${getStarRating(rating)} |`;

export const mdSkillTable = (skills: Skill[] = []) => {
  const header = getSkillTableHeader();
  const rows = skills.map((skill) => mdSkill(skill));

  return `${header}\n${rows.join('\n')}`;
};
