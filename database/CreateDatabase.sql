-- Script para crear base de datos ClientesDB
USE master;
GO

-- Crear la base de datos si no existe
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'ClientesDB')
BEGIN
    CREATE DATABASE [ClientesDB];
END
GO

USE [ClientesDB];
GO

-- Tabla Clientes
CREATE TABLE [dbo].[Clientes] (
    [Id] INT IDENTITY (1, 1) NOT NULL,
    [Nombre] NVARCHAR (100) NOT NULL,
    [Direccion] NVARCHAR (200) NULL,
    [Pais] NVARCHAR (50) NULL,
    [Identificador] NVARCHAR (20) NOT NULL,
    [FechaCreacion] DATETIME2 (7) DEFAULT (GETDATE()) NOT NULL,
    [Telefono] NVARCHAR (20) NULL,
    [Email] NVARCHAR (100) NULL,
    CONSTRAINT [PK_Clientes] PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO

-- Índice único para Identificador (Nit/DPI)
CREATE UNIQUE NONCLUSTERED INDEX [IX_Clientes_Identificador]
    ON [dbo].[Clientes]([Identificador] ASC);
GO

-- Tabla Contactos
CREATE TABLE [dbo].[Contactos] (
    [Id] INT IDENTITY (1, 1) NOT NULL,
    [Nombre] NVARCHAR (100) NOT NULL,
    [Email] NVARCHAR (100) NULL,
    [Telefono] NVARCHAR (20) NULL,
    [Puesto] NVARCHAR (100) NULL,
    [ClienteId] INT NOT NULL,
    CONSTRAINT [PK_Contactos] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Contactos_Clientes_ClienteId] FOREIGN KEY ([ClienteId]) 
        REFERENCES [dbo].[Clientes] ([Id]) ON DELETE CASCADE
);
GO

-- Índice para mejorar búsquedas por cliente
CREATE NONCLUSTERED INDEX [IX_Contactos_ClienteId]
    ON [dbo].[Contactos]([ClienteId] ASC);
GO

-- Insertar datos de ejemplo
INSERT INTO [dbo].[Clientes] (Nombre, Direccion, Pais, Identificador, Telefono, Email)
VALUES 
    ('Empresa ABC', 'Calle Principal 123', 'Guatemala', '123456-7', '5555-1234', 'info@empresaabc.com'),
    ('Comercio XYZ', 'Avenida Central 456', 'Guatemala', '765432-1', '5555-5678', 'contacto@comercioxyz.com');

INSERT INTO [dbo].[Contactos] (Nombre, Email, Telefono, Puesto, ClienteId)
VALUES
    ('Juan Pérez', 'juan@empresaabc.com', '3333-1111', 'Gerente', 1),
    ('María López', 'maria@empresaabc.com', '3333-2222', 'Supervisora', 1),
    ('Carlos García', 'carlos@comercioxyz.com', '3333-3333', 'Vendedor', 2);
GO

PRINT 'Base de datos y tablas creadas exitosamente.';
