"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "react-query";

import {
  CircularProgress,
  Box,
  IconButton,
  Tooltip,
  TableContainer,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";



import MaterialReactTable from "material-react-table";
import Link from "next/link";
import { CgEditBlackPoint } from "react-icons/cg";
import { MdDelete } from "react-icons/md";
import { makeRequest } from "@/services/makeRequest";
import { usePost } from "@/context/context";
import { useParams } from "next/navigation";

function ReactTable() {
  const [isLoading, setIsLoading] = useState(false);
  const { session } = usePost() as any;
  const [createModalOpen2, setCreateModalOpen2] = useState(false);
  const { id } = useParams();

  const {
    refetch,
    data: posts,
    isLoading: loading,
    error,
  } = useQuery(
    ["posts"],
    () =>
      makeRequest(`/api/post/get`, {
        method: "GET",
        headers: {
          authorization: session.user.accessToken,
        },
      }),
    {
      enabled: !!session,
    }
  );

  if (error) return <>{JSON.stringify(error)}</>;

  const list =
    posts !== undefined &&
    (posts.map((row: any) => {
      return {
        id: row.id,
        title: row.title,
        body: row.body,
        image: row.images[0],
        countLike: row._count.likes,
        countComment: row._count.comments,
        uploaded: row.uploaded,
        tags: row.tags,
      };
    }) as any);

  const columns = [
    {
      accessorKey: "title",
      header: "Nomi",
      size: 140,
    },
    {
      accessorKey: "countLike",
      header: "Like",
      size: 20,
    },
    {
      accessorKey: "countComment",
      header: "Comment",
      size: 20,
    },
  ];

  const deleteHandler = async (row: any) => {
    if (window.confirm(`Ushbu ${row.title} o'chirilsinmi?`)) {
      try {
        const data = await makeRequest(`/api/post/delete`, {
          method: "POST",
          headers: {
            authorization: session.user.accessToken,
          },
          data: JSON.stringify({ id: row.id, urlKey: row.image.imageKey }),
        });
        if (data.status === true) {
          toast.success(`Subject ${row.id} deleted`);
          refetch();
        }
      } catch (err) {
        toast.success(JSON.stringify(err));
      }
    }
  };

  return (
    <>
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {!isLoading && (
        <>
          <TableContainer
            sx={{
              ml: 1,
              width: { xs: 305, sm: 530, md: 750, lg: 1000, xl: 1500 },
            }}
          >
            <MaterialReactTable
              displayColumnDefOptions={{
                "mrt-row-actions": {
                  muiTableHeadCellProps: {
                    align: "center",
                  },
                  size: 120,
                },
              }}
              columns={columns as any}
              data={list}
              editingMode="modal" //default
              enableColumnOrdering
              enableEditing
              renderRowActions={({ row }: any) => (
                <Box sx={{ display: "flex", gap: "1rem" }}>
                  <Link href={`/admin/post/${row.original.id}`}>
                    <Tooltip arrow placement="left" title="Edit">
                      <IconButton onClick={() => setCreateModalOpen2(true)}>
                        <CgEditBlackPoint />
                      </IconButton>
                    </Tooltip>
                  </Link>
                  <Tooltip arrow placement="right" title="Delete">
                    <IconButton
                      color="error"
                      onClick={() => deleteHandler(row.original)}
                    >
                      <MdDelete />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
              renderBottomToolbarCustomActions={({ table }: any) => (
                <>
                  Jami sahifa: {table.getRowModel().rows.length}
                  <Typography>
                    Jami post:
                    {list?.length}
                  </Typography>
                </>
              )}
            />
          </TableContainer>
        </>
      )}
    </>
  );
}

export default ReactTable;
