import classNames from "../utils/classTransform";


export function ShopItem({ item, className, onClick }) {
  const currency = "¥"; //"₽"
  return (
    <div className={className}>
      <div className={classNames("flex")}>
        <div className={classNames("flex-shrink-0 border-r")}>
          <img
            className={classNames("object-scale-down w-[128px] object-center")}
            src={item.img}
            alt="order image"
          />
        </div>

        <div className={classNames("p-[8px] flex-col w-full")}>
          <div className={classNames("w-full flex flex-row flex-wrap items-center justify-between border-b mb-[8px]")}>
            <span className={classNames(" tracking-wider font-semibold text-left ")}>
              <button
                alt="Перейти на страницу"
                onClick={onClick}
              >
                {item.title}
              </button>
            </span>
          </div>
          <div className={classNames("text-left")}>
            <span>Предметов: </span>
            <span>
              <b>{item.count} шт.</b>
            </span>
          </div>
          <div className={classNames("text-left")}>
            <span>Доставка: </span>
            <span>
              <b>
                {item.inchina} {currency}
              </b>
            </span>
          </div>
          <div className={classNames("text-left")}>
            <span>Сумма: </span>
            <span>
              <b>
                {item.amount} {currency}
              </b>
            </span>
          </div>
          {item.delivery && (
            <div className={classNames("text-left")}>
              <span>Стоимость доставки: </span>
              <span>
                <b>
                  {item.delivery} {currency}
                </b>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}