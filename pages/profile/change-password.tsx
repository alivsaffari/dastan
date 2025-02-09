import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import LoaderSpinner from "@components/common/loader-spinner";
import Form from "@components/forms/form";
import FormInput from "@components/forms/form-input";
import FormSection from "@components/forms/form-section";
import Navigation from "@components/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "@hooks/useAccount";
import { iPasswordUpdate, zPasswordUpdate } from "@models/iUser";
import { useForm } from "react-hook-form";

export default function ChangePassword() {
	const { checkAccessRedirect, isLoading, onUpdatePassword } = useAccount();
	checkAccessRedirect();

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<iPasswordUpdate>({
		resolver: zodResolver(zPasswordUpdate),
	});

	if (isLoading) return <LoaderSpinner />;

	return (
		<Form onSubmit={handleSubmit(onUpdatePassword)}>
			<Navigation label="" path="/profile" />

			<FormSection title="password change">
				<FormInput
					labelText="your old password"
					type="password"
					warnings={errors.oldPassword?.message}
					register={register("oldPassword", { setValueAs: (v) => (v === "" ? undefined : v) })}
					required
				/>

				<FormInput
					labelText="new password"
					type="password"
					warnings={errors.newPassword?.message}
					register={register("newPassword", { setValueAs: (v) => (v === "" ? undefined : v) })}
					required
				/>

				<FormInput
					labelText="repeat new password"
					type="password"
					warnings={errors.confirm?.message}
					register={register("confirm", { setValueAs: (v) => (v === "" ? undefined : v) })}
					required
				/>

				<ButtonBase Variety={BaseButtonVariety.form} type="submit">
					update password
				</ButtonBase>
			</FormSection>
		</Form>
	);
}
