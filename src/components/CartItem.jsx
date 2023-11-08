import { BinIcon, FavoriteIcon } from "../icons";
import classNames from "../utils/classTransform";
import { Link } from "./Link";
import { SimpleDivider } from "./SimpleDivider";


export function CartItem({ item, onAddFavorite, onRemove }) {
  const currency = "¥"; //"₽"
  return (
    <div className={classNames(`flex p-[8px] h-[149px] bg-[#3F3E3B] w-[397px] rounded-[8px] ${!!onRemove && 'relative'}`)}>
      {(!!onRemove || !!onAddFavorite) &&
        <div
          className={classNames('absolute flex justify-between cursor-pointer bottom-[13px] right-[22.3px] h-[15px] w-[40px]')}
        >
          <div onClick={onAddFavorite}>
            <FavoriteIcon width={'11.7px'} height={'15px'} color="#C9CED6" />
          </div>
          <div onClick={onRemove}>
            <BinIcon width={'11.7px'} height={'15px'} color="#C9CED6" />
          </div>
        </div>}
      <img className={classNames('h-[121px] w-[123px] mr-[10.3px] rounded-[5.7px]')} src={item.img} />
      <div>
        <Link href={item.url} target="_blank" text={item.title} className={classNames('mb-[8px] text-[#8C8B8A]')} />
        <SimpleDivider className={classNames('w-[100%] mb-[8px]')} />
        <div>
          <div className={classNames('text-[#C9CED6] inline-grid grid-cols-2 auto-cols-min gap-y-[4px] gap-x-[7px]')}>
            <span>кол-во:</span>
            <span>{item.count + 'шт'}</span>
            <span>доставка:</span>
            <span>{currency + item.inchina}</span>
            <span>сумма:</span>
            <span>{currency + item.amount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
