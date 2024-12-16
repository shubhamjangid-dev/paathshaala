import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from "@/features/api/courseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const MEDIA_API = `${import.meta.env.VITE_BACKEND_URL}/media`;

const LectureTab = () => {
  // const [lectureTitle, setLectureTitle] = useState("");
  // const [uploadVideInfo, setUploadVideoInfo] = useState(null);
  // const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);
  const params = useParams();
  const { courseId, lectureId } = params;

  const { data: lectureData } = useGetLectureByIdQuery(lectureId);
  // const lecture = lectureData?.lecture;

  const [input, setInput] = useState({
    lectureTitle: "",
    videoFile: "",
    isFree: false,
    courseId,
    lectureId,
  });

  // useEffect(() => {
  //   if (lecture) {
  //     setLectureTitle(lecture.lectureTitle);
  //     setIsFree(lecture.isPreviewFree);
  //     setUploadVideoInfo(lecture.videoInfo);
  //   }
  // }, [lecture]);

  const [edtiLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation();
  const [removeLecture, { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess }] = useRemoveLectureMutation();

  const fileChangeHandler = e => {
    const file = e.target.files?.[0];
    setInput(prev => ({ ...prev, videoFile: file }));
    // if (file) {
    //   const formData = new FormData();
    //   formData.append("file", file);
    //   setMediaProgress(true);
    //   try {
    //     const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
    //       onUploadProgress: ({ loaded, total }) => {
    //         setUploadProgress(Math.round((loaded * 100) / total));
    //       },
    //     });

    //     if (res.data.success) {
    //       console.log(res);
    //       setUploadVideoInfo({
    //         videoUrl: res.data.data.url,
    //         publicId: res.data.data.public_id,
    //       });
    //       setBtnDisable(false);
    //       toast.success(res.data.message);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     toast.error("video upload failed");
    //   } finally {
    //     setMediaProgress(false);
    //   }
    // }
  };

  const editLectureHandler = async () => {
    // console.log({ lectureTitle, uploadVideInfo, isFree, courseId, lectureId });
    const formData = new FormData();
    formData.append("lectureTitle", input.lectureTitle);
    formData.append("isPreviewFree", input.isFree);
    formData.append("videoFile", input.videoFile);

    await edtiLecture({
      formData,
      courseId,
      lectureId,
    });
  };

  const removeLectureHandler = async () => {
    await removeLecture(lectureId);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (removeSuccess) {
      toast.success(removeData.message);
    }
  }, [removeSuccess]);

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>Make changes and click save when done.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            disbaled={removeLoading}
            variant="destructive"
            onClick={removeLectureHandler}
          >
            {removeLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Please wait
              </>
            ) : (
              "Remove Lecture"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Title</Label>
          <Input
            value={input.lectureTitle}
            onChange={e => setInput(prev => ({ ...prev, lectureTitle: e.target.value }))}
            type="text"
            placeholder="Ex. Introduction to Javascript"
          />
        </div>
        <div className="my-5">
          <Label>
            Video <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            onChange={fileChangeHandler}
            placeholder="Ex. Introduction to Javascript"
            className="w-fit"
          />
        </div>
        <div className="flex items-center my-5 space-x-2">
          <Switch
            checked={input.isFree}
            onCheckedChange={() => {
              setInput(prev => ({ ...prev, isFree: !prev.isFree }));
            }}
            id="airplane-mode"
          />
          <Label htmlFor="airplane-mode">Is this video FREE</Label>
        </div>

        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}

        <div className="mt-4">
          <Button
            disabled={isLoading}
            onClick={editLectureHandler}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              "Update Lecture"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
