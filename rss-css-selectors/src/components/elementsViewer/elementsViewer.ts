import { LevelItemsT, ILevelData } from '../../utils/types';
import { addElement, illuminateElementsAndCode } from '../../utils/utils';
import './elementsViewer.scss';

export default class ElementsViewer {
  constructor(
    private container: HTMLElement,
    private items?: LevelItemsT[] | null,
  ) {}

  public initElements(levelData: ILevelData): void {
    this.items = levelData.items;

    const elementsWrapper = addElement('div', 'elements-wrapper');

    const header = addElement('h2', 'elements-header');
    header.textContent = levelData.description;

    const helpBtn = addElement('button', 'elements-btn');
    helpBtn.textContent = "Help, I'm stuck!";
    helpBtn.addEventListener('click', (e) => console.log('help me'));

    const field = addElement('field');
    field.addEventListener('mouseover', (e) => illuminateElementsAndCode(e, true));
    field.addEventListener('mouseout', (e) => illuminateElementsAndCode(e, false));

    this.items.forEach((elem, indx) => {
      const itemToField = addElement(elem.element, elem.class);
      itemToField.dataset.id = String(indx);
      const tooltip = addElement('span', 'tooltip');
      tooltip.textContent = `<${elem.element}></${elem.element}>`;
      if (elem.id) {
        itemToField.classList.add(elem.id);
        tooltip.textContent = `<${elem.element} class="${elem.id}"></${elem.element}>`;
      }
      itemToField.append(tooltip);

      if (elem.innerElement) {
        const elemToItem = addElement(
          elem.innerElement.element,
          elem.innerElement.class,
        );
        elemToItem.dataset.id = `in${indx}`;
        const innerTooltip = addElement('span', 'tooltip');
        innerTooltip.textContent = `<${elem.innerElement.element}></${elem.innerElement.element}>`;

        if (elem.innerElement.id) {
          elemToItem.classList.add(elem.innerElement.id);
          innerTooltip.textContent = `<${elem.innerElement.element} class="${elem.innerElement.id}"></${elem.innerElement.element}>`;
        }

        elemToItem.append(innerTooltip);
        itemToField.append(elemToItem);
      }
      field.append(itemToField);
    });

    elementsWrapper.append(header, helpBtn, field);
    this.container.append(elementsWrapper);
  }
}
