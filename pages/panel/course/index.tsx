import ButtonBase from "@components/common/base-button";
import LoaderSpinner from "@components/common/loader-spinner";
import FormSection from "@components/forms/form-section";
import { useAccount } from "@hooks/useAccount";
import { useCourse } from "@hooks/useCourse";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { staticClientURL } from "statics/url";

export default function Courses() {
	const router = useRouter();
	const { checkAccessRedirect } = useAccount();
	checkAccessRedirect();

	const { coursesInfo, isLoading } = useCourse();

	if (isLoading) return <LoaderSpinner />;

	return (
		<div className="flex flex-col gap-4 w-full max-w-md py-4">
			<ButtonBase type="button" onClick={() => router.push(staticClientURL.panel.course.add)}>
				add new course
			</ButtonBase>

			{coursesInfo && coursesInfo.length > 0 && (
				<FormSection title="your courses">
					{coursesInfo.map((course, index) => {
						console.log(course);

						return (
							<div key={index} className="flex items-center justify-between gap-2">
								<Link href={staticClientURL.panel.course.update({ courseId: course.id })}>
									{course.title}
								</Link>
							</div>
						);
					})}
				</FormSection>
			)}
		</div>
	);
}
