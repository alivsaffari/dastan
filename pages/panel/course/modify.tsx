/* eslint-disable react-hooks/exhaustive-deps */
import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import LoaderSpinner from "@components/common/loader-spinner";
import Form from "@components/forms/form";
import FormInput from "@components/forms/form-input";
import FormSection from "@components/forms/form-section";
import TextArea from "@components/forms/form-text-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "@hooks/useAccount";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Navigation from "@components/navigation";
import { useCourse } from "@hooks/useCourse";
import { iCourseCreateForm, zCourseCreateForm } from "@models/iCourse";
import { staticClientURL } from "statics/url";
import { useCategory } from "@hooks/useCategory";
import Select from "@components/common/select";
import { selectOptionType } from "@components/common/select-multi";
import { iCategory } from "@models/iCategory";
import CourseImage from "@components/images/course-image";
import FormItemRow from "@components/forms/form-item-row";
import { zKeyword, zKeywords } from "@models/iKeyword";

export default function ModifyCourse() {
	const { checkAccessRedirect } = useAccount();
	const { coursesInfo, onAddCourse, onUpdateCourse, isLoading } = useCourse();
	const { categories } = useCategory();
	checkAccessRedirect();

	const [selectedCategory, setSelectedCategory] = useState<iCategory>();
	const [keyword, setKeyword] = useState<string>("");
	const [keywords, setKeywords] = useState<string[]>([]);

	const [course, setCourse] = useState<any>();

	const router = useRouter();

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<iCourseCreateForm>({
		resolver: zodResolver(zCourseCreateForm),
		values: course,
	});

	useEffect(() => {
		if (router.isReady) {
			const item = coursesInfo?.find((item) => item.id === parseInt(router.query.item as string));
			if (item) {
				setSelectedCategory(item.category);
				if (item?.content?.keyword && Array.isArray(item.content.keyword)) {
					setKeywords(item.content.keyword.map((item: any) => item.title));
				}
			}
			setCourse(item);
		}
	}, [router, coursesInfo]);

	async function onSubmit(data: iCourseCreateForm) {
		if (!selectedCategory) return toast.warn("select a category");
		if (course) {
			await onUpdateCourse({ ...data, categoryId: selectedCategory.id, contentId: course.contentId, keywords });
		} else {
			await onAddCourse({ ...data, categoryId: selectedCategory.id, keywords });
		}
	}

	function onSelectCategory(option: selectOptionType) {
		setSelectedCategory({ id: option.value, title: option.label });
	}

	const addKeyword = () => {
		const word = zKeyword.safeParse(keyword);
		if (!word.success) return toast.warn(word.error.issues[0].message);
		const newArr = [...keywords, keyword];
		const validate = zKeywords.safeParse(newArr);
		if (!validate.success) return toast.warn(validate.error.issues[0].message);
		setKeywords(newArr);
		setKeyword("");
	};

	const removeKeyword = (index: number) => {
		const newArr = keywords.filter((_, i) => index !== i);
		setKeywords(newArr);
	};

	if (isLoading || !router.isReady) return <LoaderSpinner />;
	if (router.query.item && !course) {
		return (
			<div className="flex flex-col items-center gap-4">
				<p>bad address</p>
				<ButtonBase type="button" onClick={() => router.push(staticClientURL.panel.course.all)}>
					back to your course list
				</ButtonBase>
			</div>
		);
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<Navigation label="" path={staticClientURL.panel.course.all} />

			{course && (
				<FormSection title="course image">
					<CourseImage id={course.contentId} />
					<ButtonBase
						type="button"
						onClick={() => router.push(staticClientURL.panel.course.image({ courseId: course.contentId }))}
					>
						update your course image
					</ButtonBase>
				</FormSection>
			)}
			<FormSection title="base info">
				<FormInput
					labelText="title"
					warnings={errors.title?.message}
					register={register("title", { setValueAs: (v) => (v === "" ? undefined : v) })}
					required
				/>
				<TextArea
					labelText="description"
					warnings={errors.description?.message}
					register={register("description", { setValueAs: (v) => (v === "" ? undefined : v) })}
					required
				/>
			</FormSection>

			<FormSection title="category">
				<Select
					selectId="profileProvinces"
					preSelect={course?.category && { label: course?.category?.title, value: course?.category?.id }}
					options={categories?.map((category) => ({ value: category.id, label: category.title }))}
					onChange={onSelectCategory}
				/>
			</FormSection>

			<FormSection title="keywords">
				<FormInput value={keyword} onChange={(e) => setKeyword(e.target.value)} />
				<ButtonBase Variety={BaseButtonVariety.form} type="button" onClick={addKeyword}>
					add new keyword
				</ButtonBase>
				{keywords.map((title, index) => (
					<FormItemRow key={index} index={index} title={title} onClick={removeKeyword} />
				))}
			</FormSection>

			<FormSection title={course ? "update" : "create"}>
				<ButtonBase>{course ? "update info" : "create new course"}</ButtonBase>
			</FormSection>
			{course && (
				<FormSection title="lessons">
					{/* TODO lesson */}
					<ButtonBase type="button" onClick={() => router.push("#")}>
						add new lesson
					</ButtonBase>

					{/* TODO lessons */}
					{/* {Array.isArray(course.jobs) &&
						course.jobs.map((job: any, index: number) => (
							<div key={index} className="flex items-center justify-between gap-2 py-2">
								<Link href={`/job/${course.id}?item=${job.id}`}>{job.title}</Link>
								<DateFormatter date={job.updatedAt} />
							</div>
						))} */}
				</FormSection>
			)}
		</Form>
	);
}
