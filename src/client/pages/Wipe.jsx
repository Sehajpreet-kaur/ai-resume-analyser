import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import { useFileStore } from "../store/fileStore.js";
import { useKVStore } from "../store/kvStore.js";


const WipeApp = () => {
    const { user,token, isLoading, error} = useAuthStore();
    const {files,fetchMyFiles,deleteFile}=useFileStore();
    const {flush}=useKVStore();
    const navigate = useNavigate();
    const isAuthenticated = Boolean(user && token);

    

    useEffect(() => {
        fetchMyFiles();
    }, []);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading, isAuthenticated]);

    const handleDelete = async () => {
        await Promise.all(files.map((file) => deleteFile(file._id)));
        await flush();
        await fetchMyFiles();
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error {error}</div>;

    return (
        <div>
            Authenticated as: {user?.username}
            <div>Existing files:</div>
            <div className="flex flex-col gap-4">
                {files.map((file) => (
                    <div key={file.id} className="flex flex-row gap-4">
                        <p>{file.originalName}</p>
                    </div>
                ))}
            </div>
            <div>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
                    onClick={handleDelete}
                >
                    Wipe App Data
                </button>
            </div>
        </div>
    );
};

export default WipeApp;