type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { Variety?: BaseButtonVariety };
export enum BaseButtonVariety {
	primary,
	form,
}
export default function ButtonBase({ Variety = BaseButtonVariety.primary, ...props }: Props) {
	return (
		<button
			{...props}
			className={`${typeRender(
				Variety
			)} flex items-center justify-center rounded-input outline-none py-2 px-4 align-middle  min-w-button active:opacity-70`}
		/>
	);
}

function typeRender(Variety: BaseButtonVariety) {
	switch (Variety) {
		case BaseButtonVariety.primary:
			return "text-white bg-theme-shade  hover:bg-theme-select";

		case BaseButtonVariety.form:
			return "bg-lime-700 text-white hover:bg-theme-select";

		default:
			break;
	}
}
