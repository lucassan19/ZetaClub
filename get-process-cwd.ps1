
$ErrorActionPreference = "Stop"

Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;

public class ProcessCwd {
    [DllImport("kernel32.dll", SetLastError = true)]
    public static extern IntPtr OpenProcess(int processAccess, bool bInheritHandle, int processId);

    [DllImport("kernel32.dll", SetLastError = true)]
    public static extern bool CloseHandle(IntPtr hObject);

    [DllImport("psapi.dll", SetLastError = true)]
    public static extern bool GetModuleFileNameEx(IntPtr hProcess, IntPtr hModule, char[] lpFilename, int nSize);

    [DllImport("kernel32.dll", SetLastError = true)]
    public static extern IntPtr GetCurrentProcess();
}
"@

function Get-ProcessCwd {
    param(
        [Parameter(Mandatory=$true)]
        [int]$ProcessId
    )

    try {
        $process = Get-Process -Id $ProcessId -ErrorAction Stop
        $path = $process.StartInfo.WorkingDirectory
        
        if ([string]::IsNullOrWhiteSpace($path)) {
            # Fallback: try to get from WMI
            $wmiProcess = Get-CimInstance Win32_Process -Filter "ProcessId=$ProcessId" -ErrorAction Stop
            $path = (Split-Path -Parent $wmiProcess.ExecutablePath)
            
            # Try to get command line arguments to infer working dir
            $cmdLine = $wmiProcess.CommandLine
            Write-Host "Command line for PID $ProcessId : $cmdLine"
        }
        
        return $path
    } catch {
        Write-Error "Error getting process CWD: $_"
        return $null
    }
}

# Get CWD of PID 10976
$cwd = Get-ProcessCwd -ProcessId 10976
Write-Host "Working directory of PID 10976: $cwd"
